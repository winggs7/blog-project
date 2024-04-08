import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { BlogService } from 'src/modules/blog/blog.service';
import { Job } from 'bullmq';
import { Process } from '@nestjs/bull';

@Processor('import')
export class ImportProcessor extends WorkerHost {
  constructor(private readonly blogService: BlogService) {
    super();
  }

  @OnWorkerEvent('active')
  onQueueActive(job: Job) {
    console.log('import active: ' + job.id);
  }

  @OnWorkerEvent('completed')
  onQueueComplete(job: Job) {
    console.log('import completed: ' + job.id);
  }

  @OnWorkerEvent('failed')
  onQueueFailed(job: Job, err: any) {
    console.log(`import failed: ${job.id}. With: ${job.data}. Error: ${err}`);
  }

  @OnWorkerEvent('error')
  onQueueError(e: any) {
    console.log(`Job has got error: ${e}`);
  }

  @OnWorkerEvent('stalled')
  onQueueStalled(job: Job) {
    console.log(`Job has been stalled: ${job.id}`);
  }

  @Process('import-blog')
  async process(job: Job<any, any, string>): Promise<void> {
    await this.blogService.verifyImport(job.data);
  }
}
