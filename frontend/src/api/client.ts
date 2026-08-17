import keycloak from "../auth/keycloak";

const API_URL = "http://127.0.0.1:30001/v1";

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    if (!keycloak.authenticated) {
        throw new Error("User is not authenticated.");
    }

    await keycloak.updateToken(30);

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`,
                ...options.headers
            }
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: "Request failed."
        }));

        throw new Error(
            error.error ?? "Request failed."
        );
    }

    return response.json();
}

export const api = {
    get<T>(endpoint: string) {
        return request<T>(endpoint, {
            method: "GET"
        });
    },

    post<T>(
        endpoint: string,
        body: unknown
    ) {
        return request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body)
        });
    },

    patch<T>(
        endpoint: string,
        body: unknown
    ) {
        return request<T>(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body)
        });
    },

    delete<T>(endpoint: string) {
        return request<T>(endpoint, {
            method: "DELETE"
        });
    }
};