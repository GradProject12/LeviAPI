exports.pagination = (model) => async (req, res, next) => {
  const params = {
    per_page: 12,
    page: +req.query.page || 1,
    filter: "created_at",
  };
  const { per_page, page } = params;

  const {count,rows} = await model.index(params);
  const total_count = (count && count) || 0;
  const page_count = Math.ceil(total_count / per_page) || 0;
  const meta = {
    links: [
      { self: `${req.baseUrl}?page=${page}` },
      { first: `${req.baseUrl}?page=1` },
      {
        previous:
          page !== 1 && `${req.baseUrl}?page=${page - 1}`,
      },
      {
        next:
          page * per_page < total_count &&
          `${req.baseUrl}?page=${page + 1}`,
      },
      { last: `${req.baseUrl}?page=${page_count}` },
    ],
    total_count: total_count,
    current_page: page,
    limit: per_page,
    page_count: page_count,
    hasPreviousPage: page > 1,
    hasNextPage: page * per_page < total_count,
    remaning_page:page_count-page
  };
  res.paginatedResult = meta;
  res.data = rows;
  next();
};
