"use client";

import {
  BackBtnIcon,
  BoardSvg,
  SearchIcon,
  TableSvg,
} from "@/app/_components/Icons";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import "@/app/_styles/Board.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

type tagType = {
  tagId: number;
  tagName: string;
};

const Page = () => {
  const [title, setTitle] = useState<string>("");
  const [notice, setNotice] = useState<boolean>(false);
  const [inputContent, setInputContent] = useState<string>("");
  const [template, setTemplate] = useState<string>("board");
  const [tags, setTags] = useState<tagType[]>([
    { tagId: 21, tagName: "react" },
    { tagId: 23, tagName: "개발" },
    { tagId: 25, tagName: "기획" },
    { tagId: 27, tagName: "vue" },
  ]);
  const [query, setQuery] = useState<string>("");
  const [tagSelect, setTagSelect] = useState<string[]>([]);
  const [isTagsMenu, setIsTagsMenu] = useState<boolean>(false);

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

  const onSubmit = useCallback(() => {
    const data = {
      notice,
      title,
      content: template !== "board" ? "표" : inputContent,
      tags: tagSelect,
    };
    console.log(data);
  }, [notice, title, template, inputContent, tagSelect]);

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

  const nodes = [{ id: 5 }];
  const [tableData, setTableData] = useState({ nodes });

  const theme = useTheme(getTheme());

  const handleUpdate = (value: any, id: any, property: any) => {
    setTableData((state) => ({
      ...state,
      nodes: state.nodes.map((node: any) => {
        if (node.id === id) {
          return { ...node, [property]: value };
        } else {
          return node;
        }
      }),
    }));
  };

  const columns = [
    {
      label: "Task",
      renderCell: (item: any) => (
        <input
          type='text'
          style={{
            width: "100%",
            border: "none",
            fontSize: "1rem",
            padding: 0,
            margin: 0,
          }}
          value={item.name}
          onChange={(event) =>
            handleUpdate(event.target.value, item.id, "name")
          }
        />
      ),
    },
    {
      label: "Task2",
      renderCell: (item: any) => (
        <input
          type='text'
          style={{
            width: "100%",
            border: "none",
            fontSize: "1rem",
            padding: 0,
            margin: 0,
          }}
          value={item.name2}
          onChange={(event) =>
            handleUpdate(event.target.value, item.id, "name2")
          }
        />
      ),
    },
  ];

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
              <CompactTable columns={columns} data={tableData} theme={theme} />
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Page;
