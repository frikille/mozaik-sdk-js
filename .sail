<pipeline>
  <job image="node:8.11.2">
    <Run command="yarn" />
    <Run command="yarn lint" />
    <Run command="yarn flow" />
    <Run command="yarn test" />
  </job>
</pipeline>
