import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
    const queryClient = useQueryClient();
    const { mutate: followUnfollow, isPending } = useMutation({
        mutationFn: async (userId) => {
            const response = await fetch(`/api/user/follow/${userId}`, {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            return data;
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] })
            ])
            toast.success("Followed successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { followUnfollow, isPending };
}

export default useFollow;