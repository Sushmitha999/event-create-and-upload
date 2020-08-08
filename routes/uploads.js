const express = require("express");
//const upload = require("express-fileupload");
//const path = require("path");
var fs = require('fs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const router = express.Router();

// HTTP POST
// upload image files to server
router.get('/:id', async(req, res) =>{
    var id = req.path
    res.render('upload_file',{id:id})
}
  );

router.post("/:id",  function(request, response) {
    //var no_of_files = 0
    var event_id = request.path
    var dir = './public/'+event_id;

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
      }
    var images = new Array();
    if(request.files) {
        //no_of_files=no_of_files+1
        var arr;
        if(Array.isArray(request.files.filesfld)) {
            arr = request.files.filesfld;
        }
        else {
            arr = new Array(1);
            arr[0] = request.files.filesfld;
        }
        for(var i = 0; i < arr.length; i++) {
            var file = arr[i];
            if(file.mimetype.substring(0,5).toLowerCase() == "image") {
                /*var r = /.+\.(.+)$/.exec(file.name);
                var ext = r ? r[1] : null
                console.log(ext)
                images[i] = "/" + String(no_of_files) + '.' + ext;
                console.log(images[i])*/
                images[i] = "/" + file.name;
                file.mv("./public/" + event_id + images[i], function (err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }
            //no_of_files=no_of_files+1
        }
    }
    // give the server a second to write the files
    setTimeout(function(){response.json(images);}, 1000);
});


module.exports = router;
