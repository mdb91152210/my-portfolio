const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
  }

  try {
    return await res.json();
  } catch (err) {
    throw new Error('Invalid JSON response');
  }
};

export default fetcher;
