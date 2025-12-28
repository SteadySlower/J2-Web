import { getAuthToken } from "@/lib/api/utils/auth";

type DeleteKanjiResponse = {
  message: string;
};

export async function deleteKanji(id: string): Promise<DeleteKanjiResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/kanjis/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("한자를 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 한자에 접근할 권한이 없습니다");
    }
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "이 한자를 사용하는 단어가 있어 삭제할 수 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "한자 삭제에 실패했습니다.");
  }

  const result: { data: DeleteKanjiResponse } = await response.json();
  return result.data;
}

