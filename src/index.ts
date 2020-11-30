import $ from "jquery";
import SliderPresenter from "./slider/presenter";
import "./index.scss";

const slider = new SliderPresenter({
  prefixCls: "slider",
  //value: [0, 10, 40, 70],
  //value: [10, 20],
  value: [22, 80],
  min: -60,
  max: 120,
  //step: 30,
  dots: true,
  marks: {
    show: true,
    // render: (v: number): string => {
    //   return `${v} $`;
    // },
    //values: [0],
    //dots: true,
  },
  // tooltip: {
  //   show: true,
  //   render: (v: number): string => {
  //     return `${v} $`;
  //   },
  //   active: true,
  // },
  allowCross: false,
  // pushable: 0,
  // disabled: true,
  // marks: {
  //   //show: true,
  // },
});

$(() => {
  slider.render($(".slider__wrapper"));
});

const update = () => {
  slider.update({
    min: -30,
    max: 180,
    // onBeforeChange: (v) => {
    //   console.log("onBeforeChange : ", v);
    // },
    // onChange: (v) => {
    //   console.log("onChange : ", v);
    // },
    step: 40,
    // onAfterChange: (v) => {
    //   console.log("onAfterChange : ", v);
    // },
    value: [60],
    // marks: {
    //   show: true,
    // },
    // tooltip: {
    //   show: true,
    //   active: true,
    // },
    //disabled: true,
  });
};

setTimeout(update, 5000);
