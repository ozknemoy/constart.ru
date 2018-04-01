export function uiTinymceConfig () {
  'ngInject';

  return  {
    setup: function(editor) {
      //Focus the editor on load
      //$timeout(function(){ editor.focus(); });
      editor.on("init", function() {
        console.log('XXXXX');
      });
      editor.on("click", function() {
        console.log('YYYYYY');
      });
    }
  }

}  