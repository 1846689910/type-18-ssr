import Path from "path";
import Fs from "fs";
import React, { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { routes } from "../../client/js/settings/routes";
import { renderRoutes } from "react-router-config";
import { configureStore } from "../../client/js/settings/store";
import { initialState } from "../../client/js/settings/reducers";
import { StaticRouter } from "react-router-dom";
import { parse as parseHtml } from "node-html-parser";
import serialize from "serialize-javascript";
import { ChunkExtractor } from "@loadable/server";

let _extractor;

function getExtractor(){
  if (!_extractor) {
    // This is the stats file generated by webpack loadable plugin
    const statsFile = Path.resolve("dist/loadable-stats.json");
    // We create an extractor from the statsFile
    _extractor = new ChunkExtractor({ statsFile });
  }
  return _extractor;
}

const getRenderedString = url => {
  const html = Fs.readFileSync(Path.resolve("dist/index.html"), "utf8");
  const App = () => renderRoutes(routes);
  const store = configureStore(initialState);
  const extractor = getExtractor();
  const markup = renderToString(
    extractor.collectChunks(
      <Provider store={store}>
        <StaticRouter location={url} context={{}}>
          <App />
        </StaticRouter>
      </Provider>
    )
  );

  const preloadedState = parseHtml(
    `<script>window.__PRELOADED_STATE__=${serialize(initialState)}</script>`,
    {
      script: true
    }
  );
  const dom = parseHtml(html, {
    script: true
  });
  dom.querySelector("#root").set_content(markup);
  dom.querySelector("body").appendChild(preloadedState);
  // dom.querySelector("body").appendChild(extractor.getScriptTags());

  return dom.toString().replace(
    '<span id="body-after-root"></span>',
    `
    <noscript>
      <h4>JavaScript is Disabled</h4>
      <p>Sorry, this webpage requires JavaScript to function correctly.</p>
      <p>Please enable JavaScript in your browser and reload the page.</p>
    </noscript>
  `
  );
};

const middleware = (req, res) => {
  res.end(getRenderedString(req.url));
};
module.exports = {
  middleware,
  getRenderedString
};
