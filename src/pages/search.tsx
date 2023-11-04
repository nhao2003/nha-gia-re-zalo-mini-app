import React, { FC, Suspense } from "react";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { Page, Input, Box, Text } from "zmp-ui";

// src/types/product.ts
interface Product {
  id: number;
  name: string;
  price: number;
}

// src/state.ts
export const keywordState = atom({
  key: "keyword",
  default: "",
});

export const searchResultState = selector<Product[]>({
  key: "searchResult",
  get: async ({ get }) => {
    const keyword = get(keywordState);
    if (keyword.trim().length > 0) {
      const params = new URLSearchParams({ keyword }).toString();
      const response = await fetch(`https://dummyjson.com/products?${params}`);
      const data = await response.json();
      return data.products;
    }
    return [];
  },
});

// src/pages/search.tsx
export const SearchPage: FC = () => {
  const [keyword, setKeyword] = useRecoilState(keywordState);
  return (
    <Page>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Suspense fallback={<div>Đang lấy danh sách sản phẩm...</div>}>
        <SearchResult />
      </Suspense>
    </Page>
  );
};

const SearchResult: FC = () => {
  const result = useRecoilValue(searchResultState);
  return (
    <Box>
      <Text.Title>Kết quả ({result.length})</Text.Title>
      {result.map((product) => (
        <div key={product.id}>
          <b>Sản phẩm: {product.name}</b>
          <u>Giá: {product.price}</u>
        </div>
      ))}
    </Box>
  );
};
