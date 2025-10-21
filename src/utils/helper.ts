// public asset images yang dikirim dari project ke folder images di public == laravel storage:link get directory asset images url
export const getPublicThumbnailUrl = (path: "thumbnails") => {
  const HOST = process.env.HOST ?? "localhost";
  const PORT = process.env.PORT ?? 3005;
  return `http://${HOST}:${PORT}/images/${path}/`;
};

export const getPublicPhotoUrl = (path: "photos") => {
  const HOST = process.env.HOST ?? "localhost";
  const PORT = process.env.PORT ?? 3005;
  return `http://${HOST}:${PORT}/images/${path}/`;
};

export const getVideoTrailerUrl = (path: "trailers") => {
  const HOST = process.env.HOST ?? "localhost";
  const PORT = process.env.PORT ?? 3005;
  return `http://${HOST}:${PORT}/videos/${path}/`;
};
