import "./index.scss";

function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

requireAll(
  require.context("./components", true, /^\.\/(?!.*(?:__tests__)).*\.(ts?)$/)
);
