module.exports = function Default(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
