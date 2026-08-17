import * as userRepository
    from "../repositories/userRepository.js";

export async function getUsers() {
    return await userRepository.findAll();
}

export async function getUser(
    userId: number
) {
    return await userRepository.findById(
        userId
    );
}

export async function getUserByIdentityId(
    identityId: string
) {
    return await userRepository.findByIdentityId(
        identityId
    );
}

export async function updateUser(
    userId: number,
    data: userRepository.UpdateUserData
) {
    const existingUser =
        await userRepository.findById(userId);

    if (!existingUser) {
        return null;
    }

    if (data.roleId !== undefined) {
        const role =
            await userRepository.roleExists(
                data.roleId
            );

        if (!role) {
            throw new Error("Role not found.");
        }
    }

    return await userRepository.updateUser(
        userId,
        data
    );
}