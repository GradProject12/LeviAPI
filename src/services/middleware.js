exports.pagination = (model) => async (req, res, next) => {
  const params = {
    per_page: +req.query.per_page || 10,
    page: +req.query.page || 1,
    filter: req.query.filter_by || "created_at",
  };
  const { per_page, page } = params;

  const items = await model.index(params);
  const total_count = (items.length && items[0].total_count) || 0;
  const page_count = Math.ceil(total_count / per_page) || 0;
  const meta = {
    links: [
      { self: `${req.baseUrl}?page=${page}&per_page=${per_page}` },
      { first: `${req.baseUrl}?page=1&per_page=${per_page}` },
      {
        previous:
          page !== 1 && `${req.baseUrl}?page=${page - 1}&per_page=${per_page}`,
      },
      {
        next:
          page * per_page < total_count &&
          `${req.baseUrl}?page=${page + 1}&per_page=${per_page}`,
      },
      { last: `${req.baseUrl}?page=${page_count}&per_page=${per_page}` },
    ],
    total_count: total_count,
    current_page: page,
    limit: per_page,
    page_count: page_count,
    hasPreviousPage: page > 1,
    hasNextPage: page * per_page < total_count,
  };
  data = [
    ...items,
  ];
  res.paginatedResult = meta;
  res.data = data;
  next();
};
