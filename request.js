import axios from "axios";

function queryParams(params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
}

const request = (url, options) => {
  // const baseUrl = process.env.domain;
  const baseUrl = "https://api.openweathermap.org";
  let apiUrl = `${baseUrl}${url}`;

  if (options.params) {
    apiUrl =
      apiUrl +
      (apiUrl.indexOf("?") === -1 ? "?" : "&") +
      queryParams(options.params);
    delete options.params;
  }

  if (options.data) {
    const formData = new FormData();
    Object.keys(options.data).map((k) => {
      formData.append(k, options.data[k]);
    });
    options.body = formData;
    delete options.data;
  }

  return axios({
    method: "get",
    url: apiUrl,
    ...options,
  });
};

export default request;