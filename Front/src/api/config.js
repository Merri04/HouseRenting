const port = 7113;
let apiServiceProviderUrl = "";

if (process.env.NODE_ENV === "development") {
    // Code to run in development environment
    apiServiceProviderUrl = `https://localhost:${port}`;
} else if (process.env.NODE_ENV === "production") {
    // Code to run in production environment
    apiServiceProviderUrl = `https://api.houseflow.no`;
} else {
    // Code to run in other environments (e.g., test)
    throw new Error("This is neither development nor production");
}

export { apiServiceProviderUrl };
