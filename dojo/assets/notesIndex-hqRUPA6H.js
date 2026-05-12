function e(f,o){for(const n of f){if(n.slug===o)return n;const r=e(n.children,o);if(r)return r}return null}export{e as f};
