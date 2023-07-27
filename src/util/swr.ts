import axios from "axios";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export const riotClientFetcher = (url: string) => axios.get(url).then((res) => res.data);