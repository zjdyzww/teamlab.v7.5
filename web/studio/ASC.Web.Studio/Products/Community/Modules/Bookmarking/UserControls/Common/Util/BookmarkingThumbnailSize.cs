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
using System.Text.RegularExpressions;

namespace ASC.Web.UserControls.Bookmarking.Common.Util
{
	public class BookmarkingThumbnailSize
	{
		public int Width { get; set; }

		public int Height { get; set; }		

		public BookmarkingThumbnailSize()
		{
			Width = BookmarkingSettings.ThumbSmallSize.Width;
			Height = BookmarkingSettings.ThumbSmallSize.Height;
		}

		public BookmarkingThumbnailSize(int width, int height)
		{
			Width = width;
			Height = height;
		}

		private const string SizePrefix = "_size";

		public override string ToString()
		{
			return String.Format("{0}{1}-{2}", SizePrefix, Width, Height);
		}

		public static BookmarkingThumbnailSize ParseThumbnailSize(string fileName)
		{
			if (!fileName.Contains(SizePrefix))
			{
				return new BookmarkingThumbnailSize();
			}
			var m = Regex.Match(fileName, String.Format(".*{0}(?<size>).*", SizePrefix));
			var sizeAsString = m.Groups["size"].Value;
			var dimensions = sizeAsString.Split('-');
			if (dimensions.Length == 2)
			{
				try
				{
					var width = Int32.Parse(dimensions[0]);
					var height = Int32.Parse(dimensions[1]);
					return new BookmarkingThumbnailSize(width, height);
				}
				catch
				{
					return new BookmarkingThumbnailSize();
				}
			}
			return new BookmarkingThumbnailSize();
		}
	}
}
