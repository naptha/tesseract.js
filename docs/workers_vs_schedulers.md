# Overview
Tesseract.js offers 2 ways to run recognition jobs: (1) using a worker directly, or (2) using a scheduler to run jobs on multiple workers in parallel.  The syntax for the latter is more complicated, but using parallel processing via schedulers provides significantly better performance for large jobs.  For more detailed documentation on each function, see the [api page](./api.md). 

# Option 1: Using Workers Directly
The following snippet recognizes text from an image using a single worker.

```javascript
(async () => {
    const worker = await Tesseract.createWorker('eng');
    const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    console.log(text);
    await worker.terminate();
})();
```

In actual use, the `createWorker` step should be separated from the `worker.recognize` step.  Doing so enables the following benefits:
1.	Workers can be prepared ahead of time
    - E.g. a worker can be created when the page is first loaded, rather than waiting for a user to upload an image to recognize
1.	Workers can be reused for multiple recognition jobs, rather than creating a new worker and loading language data for every image recognized
    - Remember to call `worker.terminate()` after all recognition is complete to free memory

# Option 2: Using Schedulers + Workers
Tesseract.js also supports executing jobs using schedulers.  A scheduler is an object that contains multiple workers, which it uses to execute jobs in parallel.  For example, the following code executes 10 jobs in parallel using 4 workers.
 
```javascript
const scheduler = Tesseract.createScheduler();

// Creates worker and adds to scheduler
const workerGen = async () => {
  const worker = await Tesseract.createWorker('eng');
  scheduler.addWorker(worker);
}

const workerN = 4;
(async () => {
  const resArr = Array(workerN);
  for (let i=0; i<workerN; i++) {
    resArr[i] = workerGen();
  }
  await Promise.all(resArr);
  /** Add 10 recognition jobs */
  const results = await Promise.all(Array(10).fill(0).map(() => (
    scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png').then((x) => console.log(x.data.text))
  )))
  await scheduler.terminate(); // It also terminates all workers.
})();
```

While using schedulers is no more efficient for a single job, they allow for quickly executing large numbers of jobs in parallel. 

When working with schedulers, note that workers added to the same scheduler should all be homogenous—they should have the same language be configured with the same parameters.  Schedulers assign jobs to workers in a non-deterministic manner, so if the workers are not identical then recognition results will depend on which worker the job is assigned to. 

# Reusing Workers in Node.js Server Code
While workers and schedulers are reusable, and we recommend reusing them between jobs, using the same worker/scheduler for a week straight within Node.js server code will cause problems.  Therefore, when using workers/schedulers within long-running Node.js server code, workers/schedulers should be killed and re-created every so often.  For example, a scheduler could be terminated and re-created after every 500 jobs.  

There are a couple reasons why periodically “resetting” workers/schedulers within server code is a good practice.  First, due to general WebAssembly limitations, the memory allocated to workers can only expand over time.  Therefore, a single large image will permanently increase the memory footprint of a worker.  Second, workers “learn” over time by adding additional words they encounter in jobs to their internal dictionaries.  While this behavior is useful within the context of a single document or group of documents, it is not necessarily desirable if recognizing hundreds of unrelated documents.  If a single scheduler runs thousands of jobs over an entire week, the internal dictionary will eventually become bloated and include typos.

