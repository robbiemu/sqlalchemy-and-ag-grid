from environment import Environment
from data_service import DataService
import threading
import time

'''the application iterates at a frequency defined at runtime, triggering the data-service task on each iteration'''


def iterate():
    '''calls the task method on the data service, and requeues itself in a thread'''
    timeout = time.time() + freq
    ds.task()
    threading.Timer(time.time() - timeout, iterate).start()


ds = DataService()
freq = Environment.get_frequency()
iterate()
