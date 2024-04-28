/* export const CVAR = "http://localhost:5001"; */

export const CVAR = 
    process.env.NODE_ENV === "development" ? 
    "http://localhost:5001" : 
    "https://raized-production.up.railway.app"