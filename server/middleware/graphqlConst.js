module.exports = function (client) {
  const photo = client.createFragment(`
    fragment on PhotoItem {
      imageId
      imagePath
      imagePathZoom
      caption
      width
      height
      source
    }
  `);

  const getNewsArticleDetail = `
    getNewsArticleDetail(articleID: $id) {
      brandId
      brandArticleId
      brandCategoryId
      brandCategoryName
      brandName
      mlCategoryId
      mlArticleId
      issueId
      magIssueId
      pubDate
      lastUpdate
      displayTime
      forceToShowDate
      title
      subTitle
      intro
      label
      pageName
      allowComment
      pollingWidgetId
      tags
      newsTrack
      themeTags
      level3Category
      level2Category
      level1Category
      level0Category
      showRelatedArticleAtTop
      categoryName
      logging {
        krux_app_brand
        krux_app_subsection_suffix
        pixelAuthor
        pixelCat
        pixelCategory
        pixelKeyword
        pixelNews
        pixelNewsType
        pixelSrc
      }
      mediaGroup {
        type
        smallPath
        largePath
        width
        height
        source
        videoId
        url
        quality
      }
      contentBlocks {
        subHead
        photos {
          ...${photo}
        }
        content
      }
      introPhotos {
        ...${photo}
      }
    }
  `

  const getCMSArticleDetail = `
    getCMSArticleDetail(articleID: $id) {
      categoryID
      publish
      expire
      lastUpdate
      title
      subTitle
      videoFile
      videoThumbnail
      anvato
      youtube
      artBlock {
        blockID
        articleID
        subTitle
        content
        imgFile
        caption
        sort
        imgWidth
        imgHeight
      }
      imgBlock {
        imgFile
        caption
        imgWidth
        imgHeight
      }
      oldCatName
      oldSecName
      tag
      restricted
      categoryName
      subCategory
      masterTag
      keyword
        ... on ContributorArticleDetail {
        contributorName
      }
    }
  `;

  return {
    getNewsArticleDetail: getNewsArticleDetail,
    getCMSArticleDetail: getCMSArticleDetail
  }
}
