(function(global) {
  
  var map = {
    'app':                        'app', // 'dist',
    '@angular':                   'libs/@angular',
    'angular2-in-memory-web-api': 'libs/angular2-in-memory-web-api',
    'rxjs':                       'libs/rxjs',
    'angular2-local-storage':               'libs/angular2-local-storage'
  };
  
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];
  
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
