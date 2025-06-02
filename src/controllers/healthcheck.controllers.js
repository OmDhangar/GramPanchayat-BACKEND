import {ApiResponse} from "../utils/ApiResponse.js";

const healthCheck = (req, res) => {
    res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
}

export { healthCheck };
// This code defines a health check controller that responds with a 200 status code 
// and a message indicating that the server is running. It uses the ApiResponse utility 
// to format the response.
//  The controller can be used in an Express.js application to provide a simple endpoint 
// for checking the server's health.
