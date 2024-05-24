"use client";

import { BackBtnIcon, BoardSvg, TableSvg } from "@/app/_components/Icons";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import "@/app/_styles/Board.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

const Page = () => {
  const [title, setTitle] = useState<string>("");
  const [notice, setNotice] = useState<boolean>(false);
  const [inputContent, setInputContent] = useState<string>("");
  const [template, setTemplate] = useState<string>("board");
  const [tags, setTags] = useState<string[]>(["react", "개발", "기획", "vue"]);
  const [selectTags, setSelectTags] = useState<string[]>([]);

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
      tags: selectTags,
    };
    console.log(data);
  }, [notice, title, template, inputContent, selectTags]);

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

          <input type='text' placeholder='태그 기능 작업 예정' />

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
