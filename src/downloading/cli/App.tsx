import React, { useReducer } from "react";
import { Box, Newline, Text } from "ink";
import { initialState, reducer, run, Steps, StepState } from "../state";

const stepMap: {
  [k in keyof Steps]: string;
} = {
  figureMap: "Figure Map",
  figureData: "Figure Data",
  furniData: "Furni Data",
  figureAssets: "Figure Assets",
  furniAssets: "Furni Assets",
};

function getStepStateText(value: string) {
  return ` ${value.toUpperCase()} `;
}

function getStepStateDisplay(state: StepState) {
  switch (state) {
    case "pending":
      return (
        <Text backgroundColor="gray" color="whiteBright" bold>
          {getStepStateText("Pending")}
        </Text>
      );

    case "runs":
      return (
        <Text backgroundColor="yellow" color="#ffffff" bold>
          {getStepStateText("Runs")}
        </Text>
      );

    case "success":
      return (
        <Text backgroundColor="green" color="#ffffff" bold>
          {getStepStateText("Success")}
        </Text>
      );
  }
}

const StepTitle = (props: {
  state: StepState;
  step: keyof Steps;
  extra?: React.ReactNode;
}) => {
  return (
    <Box marginBottom={props.extra != null ? 1 : 0}>
      <Box minWidth={10}>{getStepStateDisplay(props.state)}</Box>
      <Box marginLeft={1} flexDirection="column">
        <Text bold>{stepMap[props.step]}</Text>

        {props.extra && props.state !== "skipped" && <Text>{props.extra}</Text>}
      </Box>
    </Box>
  );
};

const ProgressDisplay = ({
  total,
  current,
  children,
}: {
  total: number;
  current: number;
  children: React.ReactNode;
}) => {
  const percentage = (current / total) * 100;

  return (
    <Text>
      <Text>{percentage.toFixed(1)}%</Text>
      {` - `}
      {children}
    </Text>
  );
};

export const App = ({
  externalVariablesUrl,
  steps,
  location,
}: {
  externalVariablesUrl: string;
  steps: Steps;
  location: string;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const keys = Object.keys(steps) as (keyof Steps)[];
  const options = React.useRef({
    externalVariablesUrl,
    location,
  });

  React.useLayoutEffect(() => {
    run({
      dispatch,
      externalVarsUrl: options.current.externalVariablesUrl,
      location: options.current.location,
      steps: steps,
    }).catch((error) => {
      //console.clear();
      console.error(error);
      process.exit(1);
    });
  }, []);

  const renderFurniAssetsExtra = () => {
    if (state.furniAssets !== "runs") return;
    if (state.lastFurniAsset == null) return;
    if (state.furniAssetsCount == null) return;
    if (state.furniAssetsCompletedCount == null) return;

    return (
      <ProgressDisplay
        total={state.furniAssetsCount}
        current={state.furniAssetsCompletedCount}
      >
        Processed: <Text bold>{state.lastFurniAsset.id}</Text>, Revision:{" "}
        <Text bold>{state.lastFurniAsset.revision}</Text>
      </ProgressDisplay>
    );
  };

  const renderFigureAssetsExtra = () => {
    if (state.figureAssets !== "runs") return;
    if (state.lastFigureAsset == null) return;
    if (state.figureAssetsCount == null) return;
    if (state.figureAssetsCompletedCount == null) return;

    return (
      <ProgressDisplay
        total={state.figureAssetsCount}
        current={state.figureAssetsCompletedCount}
      >
        Processed: <Text bold>{state.lastFigureAsset}</Text>
      </ProgressDisplay>
    );
  };

  if (!state.started) return null;

  return (
    <>
      <Box
        borderColor="black"
        borderStyle="classic"
        paddingTop={1}
        paddingBottom={1}
        paddingLeft={1}
        paddingRight={1}
        alignItems="center"
        justifyContent="center"
        marginBottom={1}
      >
        <Text>Shroom Asset Dumper</Text>
      </Box>

      <Text>
        Using external variables from url{" "}
        <Text bold>{externalVariablesUrl}</Text>
      </Text>
      <Newline />

      {steps.figureMap && (
        <StepTitle step="figureMap" state={state.figureMap} />
      )}
      {steps.figureData && (
        <StepTitle step="figureData" state={state.figureData} />
      )}
      {steps.furniData && (
        <StepTitle step="furniData" state={state.furniData} />
      )}
      {steps.figureAssets && (
        <StepTitle
          step="figureAssets"
          state={state.figureAssets}
          extra={renderFigureAssetsExtra()}
        />
      )}
      {steps.furniAssets && (
        <StepTitle
          step="furniAssets"
          state={state.furniAssets}
          extra={renderFurniAssetsExtra()}
        />
      )}
    </>
  );
};
