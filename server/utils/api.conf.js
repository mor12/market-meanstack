module.exports = {
    tokenKey: "njY7yxCCMbHYPEzkBvA6",
    urlprofileimages: "../disk/images/profiles/",
    urlCompleteInstallations: "../disk/images/installations/",
    urlDevices: "../disk/images/devices/",
    urlProducts: "../disk/images/products/",
    urlEmployee: "../disk/images/employees/",
    urlPDFDocs: "../disk/documents/",
    urlXls: "../disk/compras/",
    allowIfUserIs: function(model, compare){
        if(model){
            model = model.toUpperCase();
            compare = compare.toUpperCase();
            return model === compare;
        }
        return false;
    }
}