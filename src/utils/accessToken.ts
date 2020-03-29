export type TokenResponse = {
  accessToken?: string;
  refreshToken?: string;
};

/** Determines if an access token has been saved at a prior time,
 * and if so, attempts to refresh the token. If no prior tokens
 * have been set, fetch a brand new one and save it to localStorage.
 */
export const getTokens = async (): Promise<TokenResponse> => {
  const { storedAccessToken, storedRefreshToken } = getExistingTokens();

  if (!storedAccessToken || !storedRefreshToken) {
    return _getNewTokens();
  }

  if (_shouldRefreshTokens()) {
    return _getRefreshedTokens(storedRefreshToken);
  }

  return {
    accessToken: storedAccessToken,
    refreshToken: storedRefreshToken
  };
};

export const getExistingTokens = () => {
  const storedAccessToken =
    localStorage.getItem("spotify_access_token") ?? undefined;
  const storedRefreshToken =
    localStorage.getItem("spotify_refresh_token") ?? undefined;

  return {
    storedAccessToken,
    storedRefreshToken
  };
};

/** Accepts a refresh token and returns a fresh access token.
 * Valid for 1 hour, at which point the token will expire.
 */
const _getRefreshedTokens = async (
  storedRefreshToken: string
): Promise<TokenResponse> => {
  try {
    const response = await fetch(
      `http://tannerv.ddns.net:3001/refresh_token?refresh_token=${storedRefreshToken}`,
      {
        credentials: "same-origin",
        mode: "cors"
      }
    );

    const { access_token: accessToken } = await response.json();

    console.log("Got refreshed tokens:", { accessToken, storedRefreshToken });

    _saveTokens(accessToken, storedRefreshToken);

    return { accessToken, refreshToken: storedRefreshToken };
  } catch (error) {
    console.error("Error fetchinng refresh token:", { error });
  }

  return {
    accessToken: undefined,
    refreshToken: undefined
  };
};

/** Accepts a `code` and `state` generated from spotify user authorization,
 * and attempts to fetch a new access and refresh token.
 * Valid for 1 hour, at which point the access token will expire.
 */
const _getNewTokens = async (): Promise<TokenResponse> => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code") ?? undefined;
  const state = urlParams.get("state") ?? undefined;

  if (!code || !state) {
    return {};
  }

  try {
    const response = await fetch(
      `http://tannerv.ddns.net:3001/callback?state=${state}&code=${code}`,
      {
        credentials: "same-origin",
        mode: "cors"
      }
    );

    const { accessToken, refreshToken } = await response.json();

    _saveTokens(accessToken, refreshToken);

    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.error("error fetching token:", { error });
  }

  return {
    accessToken: undefined,
    refreshToken: undefined
  };
};

/** Checks the last time an access token was requested.
 * If a token has never been requested, return true.
 * If the last refresh was > 30 minutes ago, return true.
 */
const _shouldRefreshTokens = () => {
  const lastRefreshTimestamp = parseInt(
    localStorage.getItem("spotify_token_timestamp") ?? ""
  );
  const now = Date.now();

  if (!lastRefreshTimestamp) {
    return true;
  }

  //Gets the time difference in minutes.
  const minuteDiff = Math.round((now - lastRefreshTimestamp) / 1000 / 60);
  console.log(`Last token refresh: ${minuteDiff} minutes ago`);

  return minuteDiff > 30;
};

const _saveTokens = (accessToken?: string, refreshToken?: string) => {
  if (!accessToken || !refreshToken) {
    console.error("Error: Attempting to save undefined tokens:", {
      accessToken,
      refreshToken
    });

    return;
  }

  localStorage.setItem("spotify_access_token", accessToken);
  localStorage.setItem("spotify_refresh_token", refreshToken);
  localStorage.setItem("spotify_token_timestamp", `${Date.now()}`);
};
