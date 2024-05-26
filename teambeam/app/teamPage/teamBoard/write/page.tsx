"use client";

import {
  BackBtnIcon,
  BoardSvg,
  SearchIcon,
  TableSvg,
} from "@/app/_components/Icons";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "@/app/_styles/Board.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type TagType = {
  tagId: number;
  tagName: string;
};

type CellType = {
  key: string;
  value: string;
};

const Page = () => {
  const [title, setTitle] = useState<string>("");
  const [notice, setNotice] = useState<boolean>(false);
  const [inputContent, setInputContent] = useState<string>("");
  const [template, setTemplate] = useState<string>("board");
  const [tags, setTags] = useState<TagType[]>([
    { tagId: 21, tagName: "react" },
    { tagId: 23, tagName: "개발" },
    { tagId: 25, tagName: "기획" },
    { tagId: 27, tagName: "vue" },
  ]);
  const [query, setQuery] = useState<string>("");
  const [tagSelect, setTagSelect] = useState<string[]>([]);
  const [isTagsMenu, setIsTagsMenu] = useState<boolean>(false);
  const [cols, setCols] = useState<number>(3);
  const [rows, setRows] = useState<number>(2);
  const [cells, setCells] = useState<CellType[][]>([]);

  useEffect(() => {
    const newCells: CellType[][] = [];
    for (let i = 0; i < rows; i++) {
      const rowCells: CellType[] = [];
      for (let j = 0; j < cols; j++) {
        rowCells.push({ key: `${i}_${j}`, value: "" });
      }
      newCells.push(rowCells);
    }
    setCells(newCells);
  }, []);

  const filterTag = tags.filter((tag) => {
    return (
      tag.tagName
        ?.toLocaleLowerCase()
        ?.includes(query?.toLocaleLowerCase()?.trim()) &&
      !tagSelect.includes(tag.tagName)
    );
  });

  const router = useRouter();

  const handleNotice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNotice(e.target.checked);
  }, []);

  const handleTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const onContent = useCallback((content: string) => {
    setInputContent(content);
  }, []);

  const onTemplate = useCallback((type: string) => {
    setTemplate(type);
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const handleColumnAdd = useCallback(() => {
    setCols((prev) => prev + 1);
    setCells((prevCells) => {
      return prevCells.map((row, rowIndex) => [
        ...row,
        { key: `${rowIndex}_${cols}`, value: "" },
      ]);
    });
  }, [cols]);

  const handleRowAdd = useCallback(() => {
    setRows((prev) => prev + 1);
    setCells((prevCells) => [
      ...prevCells,
      Array.from({ length: cols }, (_, colIndex) => ({
        key: `${rows}_${colIndex}`,
        value: "",
      })),
    ]);
  }, [rows, cols]);

  const handleCellValue = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      rowIndex: number,
      cell: CellType
    ) => {
      const newCells = cells.map((row, i) =>
        i === rowIndex
          ? row.map((c) =>
              c.key === cell.key ? { ...c, value: e.target.value } : c
            )
          : row
      );
      setCells(newCells);
    },
    [cells]
  );

  const onSubmit = useCallback(() => {
    const data = {
      notice,
      title,
      type: template,
      content: template !== "board" ? cells : inputContent,
      tags: tagSelect,
    };
    console.log(data);
  }, [notice, title, template, inputContent, tagSelect, cells]);

  return (
    <div>
      <form action={onSubmit}>
        <div className='top-board-view write'>
          <div className='topBoardLeft'>
            <button className='back-btn' onClick={() => router.back()}>
              <BackBtnIcon size={13} />
            </button>

            <h2>글쓰기</h2>
          </div>

          <button className='writeBtn'>등록</button>
        </div>

        <div className='templateWrap'>
          <h4>템플릿 선택</h4>
          <div className='templateSelect'>
            <button
              className={`${template === "board" ? "active" : ""}`}
              onClick={() => onTemplate("board")}
            >
              <BoardSvg size={104} />
              <span>게시글</span>
            </button>
            <button
              className={`${template === "table" ? "active" : ""}`}
              onClick={() => onTemplate("table")}
            >
              <TableSvg size={104} />
              <span>표</span>
            </button>
          </div>
        </div>

        <div className='boardWirteInputs'>
          <div className='noticeBox'>
            <input
              type='checkbox'
              id='notice'
              checked={notice}
              onChange={handleNotice}
            />
            <label htmlFor='notice'>공지등록</label>
          </div>

          <input
            type='text'
            value={title}
            onChange={handleTitle}
            placeholder='제목'
          />

          <div className='tagWrap'>
            <div className='tagSearchBox'>
              <SearchIcon size={24} />
              <input
                type='text'
                className='tagSearchInput'
                value={query}
                onChange={(e) => setQuery(e.target.value.trimStart())}
                placeholder='태그 검색'
                onFocus={() => setIsTagsMenu(true)}
                onBlur={() => setIsTagsMenu(false)}
              />
            </div>

            {tagSelect?.length ? (
              <div className='selectTagWrap'>
                {tagSelect.map((tag) => (
                  <div key={tag} className='selectTagItem'>
                    {tag}
                    <span
                      className='tagClose'
                      onClick={() =>
                        setTagSelect(
                          tagSelect.filter((_tag) => {
                            return _tag !== tag;
                          })
                        )
                      }
                    >
                      X
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {isTagsMenu ? (
              <div className='tagsMenuWrap'>
                <ul>
                  {filterTag?.length ? (
                    filterTag.map((tag, idx) => (
                      <li
                        key={tag.tagId}
                        className='tagItem'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setIsTagsMenu(true);
                          setTagSelect((prev) => [...prev, tag.tagName]);
                        }}
                      >
                        {tag.tagName}
                      </li>
                    ))
                  ) : (
                    <li className='noItem'>검색하신 태그가 없습니다</li>
                  )}
                </ul>
              </div>
            ) : null}
          </div>

          {template === "board" ? (
            <div className='editorBox'>
              <ReactQuill
                modules={modules}
                value={inputContent}
                onChange={onContent}
                className='quillEditor'
              />
            </div>
          ) : null}

          {template === "table" ? (
            <>
              <table>
                <thead>
                  {cells.slice(0, 1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell) => (
                        <th key={cell.key}>
                          <input
                            type='text'
                            value={cell.value}
                            onChange={(e) => handleCellValue(e, rowIndex, cell)}
                          />
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {cells.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex + 1}>
                      {row.map((cell) => (
                        <td key={cell.key}>
                          <input
                            type='text'
                            value={cell.value}
                            onChange={(e) =>
                              handleCellValue(e, rowIndex + 1, cell)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <button onClick={handleRowAdd}>행 추가</button>
              <button onClick={handleColumnAdd}>열 추가</button>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Page;
