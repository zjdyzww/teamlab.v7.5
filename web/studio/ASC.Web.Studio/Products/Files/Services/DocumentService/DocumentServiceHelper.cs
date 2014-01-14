/* 
 * 
 * (c) Copyright Ascensio System Limited 2010-2014
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * http://www.gnu.org/licenses/agpl.html 
 * 
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using ASC.Common.Web;
using ASC.Core;
using ASC.Core.Caching;
using ASC.Core.Users;
using ASC.Files.Core;
using ASC.Security.Cryptography;
using ASC.Web.Files.Classes;
using ASC.Web.Files.Resources;
using ASC.Web.Files.Utils;
using ASC.Web.Studio.Utility;
using File = ASC.Files.Core.File;
using FileShare = ASC.Files.Core.Security.FileShare;
using SecurityContext = ASC.Core.SecurityContext;

namespace ASC.Web.Files.Services.DocumentService
{
    public static class DocumentServiceHelper
    {
        public static File GetParams(object fileId, int version, string shareLinkKey, bool itsNew, bool editPossible, bool tryEdit, out DocumentServiceParams docServiceParams)
        {
            File file;

            var lastVersion = true;
            var rightToEdit = true;
            var checkLink = false;

            using (var fileDao = Global.DaoFactory.GetFileDao())
            {
                var editLink = FileShareLink.Check(shareLinkKey, fileDao, out file);

                switch (editLink)
                {
                    case FileShare.ReadWrite:
                        checkLink = true;
                        break;
                    case FileShare.Read:
                        editPossible = false;
                        rightToEdit = false;
                        checkLink = true;
                        break;
                }

                if (file == null)
                {
                    var curFile = fileDao.GetFile(fileId);

                    if (0 < version && version < curFile.Version)
                    {
                        file = fileDao.GetFile(fileId, version);
                        lastVersion = false;
                    }
                    else
                    {
                        file = curFile;
                    }
                }
            }
            return GetParams(file, lastVersion, checkLink, itsNew, editPossible, rightToEdit, tryEdit, out docServiceParams);
        }

        public static File GetParams(File file, bool lastVersion, bool checkLink, bool itsNew, bool editPossible, bool rightToEdit, bool tryEdit, out DocumentServiceParams docServiceParams)
        {
            if (!TenantExtra.GetTenantQuota().DocsEdition) throw new Exception(FilesCommonResource.ErrorMassage_PayTariffDocsEdition);

            if (!checkLink && CoreContext.UserManager.GetUsers(SecurityContext.CurrentAccount.ID).IsVisitor())
            {
                rightToEdit = false;
            }

            if (file == null) throw new Exception(FilesCommonResource.ErrorMassage_FileNotFound);

            if (file.RootFolderType == FolderType.TRASH) throw new Exception(FilesCommonResource.ErrorMassage_ViewTrashItem);

            if (!checkLink)
            {
                rightToEdit = rightToEdit && Global.GetFilesSecurity().CanEdit(file);
                if (editPossible && !rightToEdit)
                {
                    editPossible = false;
                }

                if (!editPossible && !Global.GetFilesSecurity().CanRead(file)) throw new SecurityException(FilesCommonResource.ErrorMassage_SecurityException_ReadFile);
            }

            rightToEdit = rightToEdit && ((file.FileStatus & FileStatus.IsEditing) != FileStatus.IsEditing || FileUtility.CanCoAuhtoring(file.Title));
            if (editPossible && !rightToEdit)
            {
                editPossible = false;
            }

            rightToEdit = rightToEdit && !(FileLocker.SingleEditing && FileLocker.GetLockedBy(file.ID).Contains(SecurityContext.CurrentAccount.ID) && !SecurityContext.CurrentAccount.ID.Equals(ASC.Core.Configuration.Constants.Guest.ID));
            if (editPossible && !rightToEdit)
            {
                editPossible = false;
            }

            rightToEdit = rightToEdit && FileUtility.CanWebEdit(file.Title);
            if (editPossible && !rightToEdit)
            {
                editPossible = false;
            }

            if (!editPossible && !FileUtility.CanWebView(file.Title)) throw new Exception(FilesCommonResource.ErrorMassage_NotSupportedFormat);

            var versionForKey = file.Version;

            if (!FileLocker.LockVersion(file.ID))
                versionForKey++;

            //CreateNewDoc
            if (itsNew && file.Version == 1 && file.ConvertedType != null && file.CreateOn == file.ModifiedOn)
            {
                versionForKey = 1;
            }

            var docKey = GetDocKey(file.ID, versionForKey, file.CreateOn);
            var modeWrite = editPossible && tryEdit;

            docServiceParams = new DocumentServiceParams
                {
                    File = file,
                    Key = docKey,
                    CanEdit = rightToEdit && lastVersion,
                    ModeWrite = modeWrite,
                };

            return file;
        }

        public static string GetDocKey(object fileId, int fileVersion, DateTime modified)
        {
            var str = String.Format("teamlab_{0}_{1}_{2}_{3}",
                                    fileId,
                                    fileVersion,
                                    modified.GetHashCode(),
                                    Global.GetDocDbKey());

            var keyDoc = Encoding.UTF8.GetBytes(str)
                                 .ToList()
                                 .Concat(MachinePseudoKeys.GetMachineConstant())
                                 .ToArray();

            return DocumentServiceConnector.GenerateRevisionId(Hasher.Base64Hash(keyDoc, HashAlg.SHA256));
        }


        private static readonly ICache CacheUri = new AspCache();

        public static string GetExternalUri(File file)
        {
            try
            {
                using (var fileDao = Global.DaoFactory.GetFileDao())
                using (var fileStream = fileDao.GetFileStream(file))
                {
                    var docKey = GetDocKey(file.ID, file.Version, file.ModifiedOn);

                    var uri = CacheUri.Get(docKey) as string;
                    if (string.IsNullOrEmpty(uri))
                    {
                        uri = DocumentServiceConnector.GetExternalUri(fileStream, MimeMapping.GetMimeMapping(file.Title), docKey);
                    }
                    CacheUri.Insert(docKey, uri, DateTime.UtcNow.Add(TimeSpan.FromMinutes(1)));
                    return uri;
                }
            }
            catch (Exception exception)
            {
                Global.Logger.Error("Get external uri: ", exception);
            }
            return null;
        }

        public static bool HaveExternalIP()
        {
            if (!CoreContext.Configuration.Standalone)
                return true;

            var checkExternalIp = FilesSettings.CheckHaveExternalIP;
            if (checkExternalIp.Value.AddDays(5) >= DateTime.UtcNow)
            {
                return checkExternalIp.Key;
            }

            string convertUri;
            try
            {
                const string toExtension = ".xlsx";
                var fileName = "new";
                var fileExtension = FileUtility.GetInternalExtension(toExtension);
                fileName += fileExtension;

                var fileUri = CommonLinkUtility.FileHandlerPath + UrlConstant.ParamsDemo + "&" + CommonLinkUtility.FileTitle + "=" + fileName;
                fileUri = CommonLinkUtility.GetFullAbsolutePath(string.Format(fileUri, FileUtility.GetFileTypeByFileName(fileName)));

                DocumentServiceConnector.GetConvertedUri(fileUri, fileExtension, toExtension, Guid.NewGuid().ToString(), false, out convertUri);
            }
            catch
            {
                convertUri = string.Empty;
            }

            var result = !string.IsNullOrEmpty(convertUri);
            FilesSettings.CheckHaveExternalIP = new KeyValuePair<bool, DateTime>(result, DateTime.UtcNow);
            return result;
        }
    }
}