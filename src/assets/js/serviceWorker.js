importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

workbox.setConfig({
  debug: false,
});

workbox.core.setCacheNameDetails({
  prefix: "",
  suffix: "",
});