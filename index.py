from environment import Environment
from data_service import DataService
import multiprocessing
import time
import threading
from timer import Timer

'''the application iterates at a frequency defined at runtime, triggering the data-service task on each iteration'''


def iterate(out_q, thread_index):
    '''calls the task method on the data service, and requeues itself in a thread'''
    while True:
        timeout = time.time() + freq

        data = DataService.get_data()
        next = timeout - time.time()
        out_q.put((thread_index, data))

        if Environment.is_exact_frequency():
            print('completed.. waiting {} seconds before next run'.format(
                int(round(next))))
        else:
            next = 0

        time.sleep(next)


def manage_data(in_q):
    ds = DataService()
    while True:
        thread_index, data = in_q.get()
        print(
            '[__main__::manage_data] DataService - sending data for thread', thread_index)

        ds.task(data)


freq = Environment.get_frequency()

if __name__ == "__main__":
    thread_count = multiprocessing.cpu_count() - 1 if Environment.is_threaded() else 1
    thread_count = thread_count if thread_count > 1 else 2
    print('starting {} threads'.format(thread_count))

    q = multiprocessing.Queue()
    threads = []

    threading.Thread(target=manage_data, args=(q,)).start()

    pool = multiprocessing.Pool(processes=thread_count)
    for index in range(thread_count):
        p = pool.Process(target=iterate, args=(q, index), group=None)
        p.start()
        threads.append(p)
    pool.close()
    pool.join()
