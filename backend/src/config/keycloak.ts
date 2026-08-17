export const keycloakConfig = {
    issuer: "http://localhost:8080/realms/DistrictCore",
    audience: "districtcore-api",
    jwksUri:
        "http://localhost:8080/realms/DistrictCore/protocol/openid-connect/certs"
};