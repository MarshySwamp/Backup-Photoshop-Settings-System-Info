/*
Backup Photoshop Settings and System Info.jsx
v1.0, Stephen Marsh - 25th September 2022
With inspiration from:
https://community.adobe.com/t5/photoshop-ecosystem-ideas/reset-preferences-should-back-them-up-include-sys-info/idi-p/13216667
https://helpx.adobe.com/photoshop/using/preferences.html#Manually
https://github.com/MarshySwamp/Backup-Photoshop-Settings-Universal

The system info will be written to a text file on the desktop titled "Adobe Photoshop #### System Info.txt", (with #### being the version number).
The settings/prefs files will be copied to a new folder on the desktop titled "Adobe Photoshop #### Settings", (with #### being the version number).
*/

#target photoshop

try {

    var os = $.os.toLowerCase().indexOf("mac") >= 0 ? "mac" : "windows";
    if (os === "mac") {
        sysInfoLF = "Unix";
    } else {
        sysInfoLF = "Windows";
    }

    var appPath = app.path.fsName.replace(/^\/.+\//, '');
    var sysInfo = new File("~/Desktop/" + appPath + " System Info.txt");
    sysInfo.open('w');
    sysInfo.encoding = 'UTF-8';
    sysInfo.lineFeed = sysInfoLF;
    sysInfo.write(app.systemInformation);
    sysInfo.close();

    if (os === "mac") {
        // alert("It's a Mac!");
        var userSettingsDir = '~/Library/Preferences/' + appPath + ' Settings';
        var userSettingsDirOpen = Folder(userSettingsDir);
        //userSettingsDirOpen.execute();

    } else {
        // alert("It's Windows!");
        var userSettingsDir = '~/appData/Roaming/Adobe/' + appPath + '/' + appPath + ' Settings';
        var userSettingsDirOpen = Folder(userSettingsDir);
        //userSettingsDirOpen.execute();
    }

    var backupDir = new Folder("~/Desktop/" + appPath + ' Settings');
    if (!backupDir.exists) backupDir.create();

    /*
    Folder and file copy by r-bin
    https://community.adobe.com/t5/photoshop-ecosystem-discussions/a-script-to-clone-copy-a-folder-that-contains-multi-folders-and-files-to-another-folder/m-p/12121520
    */
    var ret = copy_folder(userSettingsDir, backupDir);

    function copy_folder(src_path, dst_path) {
        try {
            var f = (new Folder(src_path)).getFiles();

            for (var i = 0; i < f.length; i++)
                if (!copy_file(f[i], dst_path)) return false;

            return true;
        } catch (e) {
            alert(e);
        }
    }

    function copy_file(full_path, new_path) {
        try {
            var file = new File(full_path);

            var folder = new File(new_path);

            if (file.length < 0) {
                if (!create_path(new_path + "/" + file.name)) return false;
                if (!copy_folder(full_path, new_path + "/" + file.name)) return false;

                return true;
            } else {
                if (!create_path(new_path)) return false;
                if (!file.copy(new_path + "/" + file.name)) return false;

                return true;
            }

            function create_path(path) {
                var folder = new Folder(path);

                if (!folder.exists) {
                    var f = new Folder(folder.path);
                    if (!f.exists)
                        if (!create_path(folder.path)) return false;

                    if (!folder.create()) return false;
                }

                return true;
            }
        } catch (e) {
            throw (e);
        }
    }

    alert("A backup copy of your Photoshop Settings folder and System Info has been created on the desktop.");

} catch (e) {
    alert(e);
}
