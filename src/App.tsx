import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

// インターフェース定義
interface FilterProps {
	filterText: string;
	inStockOnly: boolean;
}

interface SearchBarFilterProps extends FilterProps {
	onFilterTextChange: (filterText: string) => void;
	onInStockOnlyChange: (inStockOnly: boolean) => void;
}

interface Product {
	category: string;
	name: string;
	stocked: boolean;
	price: string;
}

interface FilterableProductTableProps {
	products: Product[];
}

interface ProductTableProps extends FilterProps {
	products: Product[];
}

interface ProductRowProps {
	product: Product;
}

interface ProductCategoryRowProps {
	category: string;
}

function App() {
	return <FilterableProductTable products={PRODUCTS} />;
}

export default App;

function ProductCategoryRow({ category }: ProductCategoryRowProps) {
	return (
		<tr>
			<th colSpan={2}>{category}</th>
		</tr>
	);
}

function ProductRow({ product }: ProductRowProps) {
	const name = product.stocked ? (
		product.name
	) : (
		<span style={{ color: "red" }}>{product.name}</span>
	);

	return (
		<tr>
			<td>{name}</td>
			<td>{product.price}</td>
		</tr>
	);
}

function ProductTable({
	products,
	filterText,
	inStockOnly,
}: ProductTableProps) {
	const rows = [];
	let lastCategory: string | null = null;

	for (const product of products) {
		// フィルタリング処理
		//商品名に検索キーワード（filterText）が含まれているかどうかを調べる
		//すべて小文字にして比較する
		if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
			// 検索キーワードが含まれていない場合は表示しない。（その行は表示しない）
			continue;
		}

		// 「在庫ありのみ表示する」というチェックボックスがオンになっているとき（inStockOnly = true）に、
		// 在庫がない商品(product.stocked = false)はスキップする、
		//つまり、在庫有りのみを表示するときに、在庫がないものは表示しない。
		if (inStockOnly && !product.stocked) {
			continue;
		}

		if (product.category !== lastCategory) {
			rows.push(
				<ProductCategoryRow
					category={product.category}
					key={product.category}
				/>,
			);
		}
		rows.push(<ProductRow product={product} key={product.name} />);
		lastCategory = product.category;
	}

	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Price</th>
				</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
}

function SearchBar({
	filterText,
	inStockOnly,
	onFilterTextChange,
	onInStockOnlyChange,
}: SearchBarFilterProps) {
	return (
		<form>
			<input
				type="text"
				placeholder="Search..."
				value={filterText}
				onChange={(e) => onFilterTextChange(e.target.value)}
			/>
			<label>
				<input
					type="checkbox"
					checked={inStockOnly}
					onChange={(e) => onInStockOnlyChange(e.target.checked)}
				/>{" "}
				Only show products in stock
			</label>
		</form>
	);
}

function FilterableProductTable({ products }: FilterableProductTableProps) {
	const [filterText, setFilterText] = useState("");
	const [inStockOnly, setInStockOnly] = useState(false);
	return (
		<div>
			<SearchBar
				filterText={filterText}
				inStockOnly={inStockOnly}
				onFilterTextChange={setFilterText}
				onInStockOnlyChange={setInStockOnly}
			/>
			<ProductTable
				filterText={filterText}
				inStockOnly={inStockOnly}
				products={products}
			/>
		</div>
	);
}

const PRODUCTS = [
	{ category: "Fruits", price: "$1", stocked: true, name: "Apple" },
	{ category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
	{ category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
	{ category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
	{ category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
	{ category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];
