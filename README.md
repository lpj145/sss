### Statistics analyzer

This project has the purpose to analyze the costs of an organization in a time interval,
reading the data that is generated from a seed application in an endpoint and then
will apply it to another one to reach out to the following questions:

  1 Which day was the most expensive day?

  2 Which is the most expensive counterparty?

  3 How much is the balance in the end of the interval?

The tools that I used in this project were:
  - nodejs v20
  - expressjs
  - redis
  - bullmq
  - typescript 5
  - rollup
  - esbuild
  - vuejs 2

For specific batch processing data, it will use a separted file(job) for earch of one primary quetions,
and for generate enough simulation data, it will use a single file(job) to resolve all the questions, in
this scenario the metrics of performance and time will be more realistic. 