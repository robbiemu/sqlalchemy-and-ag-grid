from environment import Environment
from data_service import DataService
import threading
import time

'''the application iterates at a frequency defined at runtime, triggering the data-service task on each iteration'''


def iterate():
    '''calls the task method on the data service, and requeues itself in a thread'''
    timeout = time.time() + freq
    ds.task()
    next = timeout - time.time()
    if Environment.is_exact_frequency():
        print('completed.. waiting {} seconds before next run'.format(
            int(round(next))))
    else:
        next = 0
    threading.Timer(next, iterate).start()


ds = DataService()
freq = Environment.get_frequency()
iterate()
