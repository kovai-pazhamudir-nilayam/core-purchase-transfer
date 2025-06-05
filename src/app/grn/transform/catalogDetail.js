function transformCatalogDetail({ ksinDetails }) {
  const itemMap = {};
  console.log("ksinDetails", ksinDetails);
  ksinDetails.forEach(item => {
    itemMap[item.ksin] = {
      ksin: item.ksin,
      kpn_title: item.kpn_title,
      erp_title: item.erp_title,
      primary_image_url: item?.pack_list[0]?.media?.images[0]?.url,
      category_id: item.category_id,
      category_name: item.category_name,
      brand_id: item?.brand_info?.brand_id,
      brand_name: item?.brand_info?.brand_name,
      consumption_mark: item.consumption_mark,
      is_fragile: item?.scm_info?.is_fragile,
      is_dangerous: item?.scm_info?.is_dangerous,
      is_bulky: item?.scm_info?.is_bulky,
      is_perishable: item?.scm_info?.is_perishable,
      is_weighed_item: item?.is_weighed_item
    };
  });
  // console.log("itemMap", itemMap);
  return itemMap;
}

module.exports = {
  transformCatalogDetail
};
