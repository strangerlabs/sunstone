module.exports = {
  // app
  AppHealthRequest: require('./app/AppHealthRequest'),
  AppNetworkRequest: require('./app/AppNetworkRequest'),
  AppRequest: require('./app/AppRequest'),
  AppRestartRequest: require('./app/AppRestartRequest'),
  AppStartRequest: require('./app/AppStartRequest'),
  AppStopRequest: require('./app/AppStopRequest'),

  // plugins
  PluginDisableRequest: require('./plugins/PluginDisableRequest'),
  PluginInstallRequest: require('./plugins/PluginInstallRequest'),
  PluginRemoveRequest: require('./plugins/PluginRemoveRequest'),
  PluginRestartRequest: require('./plugins/PluginRestartRequest'),
  PluginsGetRequest: require('./plugins/PluginsGetRequest'),
  PluginsGetSettingsRequest: require('./plugins/PluginsGetSettingsRequest'),
  PluginsPutSettingsRequest: require('./plugins/PluginsPutSettingsRequest'),
  PluginsRequest: require('./plugins/PluginsRequest'),
  PluginStartRequest: require('./plugins/PluginStartRequest'),
  PluginStopRequest: require('./plugins/PluginStopRequest')
}
