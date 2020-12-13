import $ from "jquery";
import "./slider/index";
import "./styles/index.scss";

const props = {
  prefixCls: "slider",
  // values: [0, 40, 10, 70],
  // values: [22, 80],
  values: [10],
  vertical: true,
  min: -60,
  max: 120,
  step: 30,
  dot: {
    on: true,
  },
  mark: {
    on: true,
    // render: (v: number): string => {
    //   return `${v} $`;
    // },
    // values: [16],
    // dot: true,
  },
  tooltip: {
    on: true,
    render: (v: number): string => {
      if (v === 60) {
        return "☃";
      } else if (v === 90) {
        return "♥";
      }
      return `${v} $`;
    },
    always: true,
  },
  allowCross: false,
  // push: 0,
  // disabled: true,
  // marks: {
  //   //show: true,
  // },
};

$(() => {
  const slider1 = $(".slider__wrapper1").slider(props).data("slider");
  // const slider2 = $(".slider__wrapper2").slider().data("slider");
  // setTimeout(
  //   () => slider1.setProps({ values: [30, 90, 20], push: 10, step: 10 }),
  //   5000
  // );
  // setTimeout(
  //   () =>
  //     slider1.setProps({ values: [60], push: 10, step: 10, dot: { on: true } }),
  //   10000
  // );
  // setTimeout(() => slider2.setProps({ values: [30, 90, 20], push: 10 }), 5000);
  // setTimeout(() => slider2.setProps({ values: [60], push: 10 }), 10000);
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
