from environment import Environment
from data_service import DataService
import threading

'''the application iterates at a frequency defined at runtime, triggering the data-service task on each iteration'''


def iterate():
    '''calls the task method on the data service, and requeues itself in a thread'''
    ds.task()
    threading.Timer(freq, iterate).start()


ds = DataService()
freq = Environment.get_frequency()
iterate()
