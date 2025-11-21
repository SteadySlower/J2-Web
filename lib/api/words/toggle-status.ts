import { getAuthToken } from "@/lib/api/utils/auth";

export async function toggleWordStatus(
  id: string,
  newStatus: "learning" | "learned"
): Promise<"learning" | "learned"> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/words/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("단어를 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 단어에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "단어 상태 변경에 실패했습니다.");
  }

  const result: {
    data: {
      status: "learning" | "learned";
    };
  } = await response.json();
  return result.data.status;
}
