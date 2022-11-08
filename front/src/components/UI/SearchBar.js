import * as Api from "../../api";
import { useState, useEffect } from "react";
import searchBar from "../../styles/searchBar.css";
import { Form } from "react-bootstrap";
const Search = ({ setSearchData, setIsEmpty }) => {
  const [Selected, setSelected] = useState("all");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      test();
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const test = () => {
    Api.get2(`search?option=${Selected}&contents=${inputValue}`).then((res) => {
      setSearchData(res.data);
    });
  };
  const handleChangeInput = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
    setIsEmpty(true);
  };

  const handleChangeSelect = (e) => {
    e.preventDefault();
    setSelected(e.target.value);
  };

  return (
    <div css={{ searchBar }} id="formInput">
      <form
        id="formwidth"
        name="profile"
        onChange={handleChangeInput}
        autoComplete="on"
      >
        <Form.Select
          aria-label="Default select example"
          onChange={handleChangeSelect}
          style={{ height: "100%", width: "150px" }}
        >
          <option value="all">통합 검색</option>
          <option value="name">이름</option>
          <option value="email">이메일</option>
          <option value="description">내용</option>
        </Form.Select>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="search"
            className="form-control rounded formsearch"
            aria-label="Search"
            aria-describedby="search-addon"
            style={{ Width: "100%", minWidth: "150px" }}
          />
          <input style={{ display: "none " }} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
      </form>
    </div>
  );
};

export default Search;
