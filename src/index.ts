import $ from "jquery";
//import SliderPresenter from "./slider/presenter";
import "./slider/index";
import "./index.scss";

const props = {
  prefixCls: "slider",
  //value: [0, 10, 40, 70],
  //value: [10, 20],
  //values: [22, 80],
  min: -60,
  max: 120,
  //step: 30,
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
};

$(() => {
  $(".slider__wrapper").slider(props);
});

// const slider = new SliderPresenter(props);

// $(() => {
//   slider.render($(".slider__wrapper"));
// });

// const update = () => {
//   slider.update({
//     min: -30,
//     max: 180,
//     // onBeforeChange: (v) => {
//     //   console.log("onBeforeChange : ", v);
//     // },
//     // onChange: (v) => {
//     //   console.log("onChange : ", v);
//     // },
//     step: 40,
//     // onAfterChange: (v) => {
//     //   console.log("onAfterChange : ", v);
//     // },
//     value: [60],
//     marks: {
//       show: true,
//     },
//     tooltip: {
//       show: true,
//       active: true,
//     },
//     //disabled: true,
//   });
// };

// setTimeout(update, 5 * 1000);

// const update1 = () => {
//   slider.update({
//     min: -30,
//     max: 300,
//     // onBeforeChange: (v) => {
//     //   console.log("onBeforeChange : ", v);
//     // },
//     // onChange: (v) => {
//     //   console.log("onChange : ", v);
//     // },
//     step: 30,
//     // onAfterChange: (v) => {
//     //   console.log("onAfterChange : ", v);
//     // },
//     value: [90, 60, 30],
//     marks: {
//       show: true,
//       dots: true,
//       values: [60, 90, 30],
//       render: (v: number): string => `=${v}=`,
//     },
//     tooltip: {
//       show: true,
//       active: true,
//       render: (v: number): string => `${v}$`,
//     },
//     //disabled: true,
//   });
// };

// setTimeout(update1, 10 * 1000);

// const update2 = () => {
//   slider.update({
//     min: -30,
//     max: 300,
//     // onBeforeChange: (v) => {
//     //   console.log("onBeforeChange : ", v);
//     // },
//     // onChange: (v) => {
//     //   console.log("onChange : ", v);
//     // },
//     step: 30,
//     // onAfterChange: (v) => {
//     //   console.log("onAfterChange : ", v);
//     // },
//     value: [44],
//     marks: {
//       show: true,
//       dots: true,
//       values: [60, 90, 30],
//     },
//     tooltip: {
//       show: true,
//     },
//     //disabled: true,
//   });
// };

// setTimeout(update2, 15 * 1000);
