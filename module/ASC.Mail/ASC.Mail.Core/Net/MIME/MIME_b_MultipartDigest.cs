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

namespace ASC.Mail.Net.MIME
{
    #region usings

    using System;
    using IO;

    #endregion

    /// <summary>
    /// This class represents MIME multipart/digest body. Defined in RFC 2046 5.1.5.
    /// </summary>
    /// <remarks>
    /// The "multipart/digest" Content-Type is intended to be used to send collections of messages.
    /// </remarks>
    public class MIME_b_MultipartDigest : MIME_b_Multipart
    {
        #region Properties

        /// <summary>
        /// Gets default body part Content-Type. For more info see RFC 2046 5.1.
        /// </summary>
        public override MIME_h_ContentType DefaultBodyPartContentType
        {
            /* RFC 2046 5.1.6.
                The absence of a Content-Type header usually indicates that the corresponding body has
                a content-type of "message/rfc822".
            */

            get
            {
                MIME_h_ContentType retVal = new MIME_h_ContentType("message/rfc822");

                return retVal;
            }
        }

        #endregion

        #region Constructor

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="contentType">Content type.</param>
        /// <exception cref="ArgumentNullException">Is raised when <b>contentType</b> is null reference.</exception>
        /// <exception cref="ArgumentException">Is raised when any of the arguments has invalid value.</exception>
        public MIME_b_MultipartDigest(MIME_h_ContentType contentType) : base(contentType)
        {
            if (
                !string.Equals(contentType.TypeWithSubype,
                               "multipart/digest",
                               StringComparison.CurrentCultureIgnoreCase))
            {
                throw new ArgumentException(
                    "Argument 'contentType.TypeWithSubype' value must be 'multipart/digest'.");
            }
        }

        #endregion

        /// <summary>
        /// Parses body from the specified stream
        /// </summary>
        /// <param name="owner">Owner MIME entity.</param>
        /// <param name="mediaType">MIME media type. For example: text/plain.</param>
        /// <param name="stream">Stream from where to read body.</param>
        /// <returns>Returns parsed body.</returns>
        /// <exception cref="ArgumentNullException">Is raised when <b>stream</b>, <b>mediaType</b> or <b>stream</b> is null reference.</exception>
        /// <exception cref="ParseException">Is raised when any parsing errors.</exception>
        protected new static MIME_b Parse(MIME_Entity owner, string mediaType, SmartStream stream)
        {
            if (owner == null)
            {
                throw new ArgumentNullException("owner");
            }
            if (mediaType == null)
            {
                throw new ArgumentNullException("mediaType");
            }
            if (stream == null)
            {
                throw new ArgumentNullException("stream");
            }
            if (owner.ContentType == null || owner.ContentType.Param_Boundary == null)
            {
                throw new ParseException("Multipart entity has not required 'boundary' paramter.");
            }

            MIME_b_MultipartDigest retVal = new MIME_b_MultipartDigest(owner.ContentType);
            ParseInternal(owner, mediaType, stream, retVal);

            return retVal;
        }
    }
}