interface TokenInfo {
    id: number,
    email: string,
    isRefresh: boolean
}

interface Token {
    accessToken: string,
    refreshToken: string
}

export { TokenInfo, Token }