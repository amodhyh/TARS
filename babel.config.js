module.exports = function (api) {
    api.cache(true);
    return {
        presets:["expo-router/babel"],
        presets: ['babel-preset-expo']
    };
  };
  