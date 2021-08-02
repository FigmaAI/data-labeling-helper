import os
import json
from xml.etree.ElementTree import Element, SubElement

# https://blog.naver.com/ytlee64/222246610128
# https://blog.naver.com/ytlee64/222398769693
# https://blog.naver.com/ytlee64/222142131762
# https://blog.naver.com/ytlee64/222052882042
# https://blog.naver.com/ytlee64/222297391409

def beautify(elem, indent=0):
    """
    xml 트리를 문자열로 변환합니다.

    :param elem: xml element
    :param indent: 앞에서 표시할 인덴트 레벨
    """
    result0 = f"{'    ' * indent}<{elem.tag}>"
    # 값이 있는 태그면 값을 바로 출력
    if elem.text is not None:
        result0 += elem.text + f"</{elem.tag}>\n"
    # 값이 없고 자식 노드가 있으면 재귀 호출로 출력합니다.
    else:
        result0 += "\n"
        for _child in elem:
            result0 += beautify(_child, indent + 1)
        result0 += f"{'    ' * indent}</{elem.tag}>\n"
    return result0

def isvalidbdnbox(xmin,xmax,ymin,ymax):
    
    ## 다중 if를 추가해서 bnd 박스를 검증해야 합니다.
    # bounding box(bndbox)가 음수이면 안됩니다. 
    if(xmin<0 or xmax<0 or ymin<0 or ymax<0):
        print("음수")
        return False
    # bndbox의 xmax 값은 1440, ymax 값은 2560을 넘으면 안됩니다. 
    if(xmax>1440  or ymax>2560):
        print("최대값 초과")
        return False

    # xmin 값은 xmax 보다 클 수 없습니다. 
    # ymin 값은 ymax 보다 클 수 없습니다. 
    if(xmin>xmax  or ymin>ymax):
        print("최소값 초과")
        return False
        
    
    return True

def recursive(child, result_out):
    """
    원하는 역할을 하기 위해서 재귀호출을 할 수 있는 함수를 생성합니다.
    """
    obj = Element("object")

    # bound 정보
    bounds = child['bounds']

    # name 설정
    SubElement(obj, "name").text = child['componentLabel']
    # difficult 설정
    SubElement(obj, "difficult").text = '0'

    # bndbox 설정
    bndbox = SubElement(obj, "bndbox")
    xmin=bounds[0]
    ymin=bounds[1]
    xmax=bounds[2]
    ymax=bounds[3]
    
    if(isvalidbdnbox(xmin,xmax,ymin,ymax)):
        SubElement(bndbox, "xmin").text = str(xmin/4)
        SubElement(bndbox, "ymin").text = str(ymin/4)
        SubElement(bndbox, "xmax").text = str(xmax/4)
        SubElement(bndbox, "ymax").text = str(ymax/4)
        result_out.append(beautify(obj))

    
    # 생성한 object 태그를 문자열로 변환해서 추가합니다.
    if 'children' not in child:
        return

    # 자식 노드가 있는 경우 자식 노드에 대해 재귀 호출을 수행합니다.
    for ch in child.get('children', []):
        recursive(ch, result_out)


def json2xml(infile, outfile):
    """
    json2xml 함수
    param infile :
    ourfile :
    """
    result_out = []
    imgName = infile.replace("./json/", "")
    imgName = imgName.replace("json", "jpg")

    # 파일을 읽어서
    with open(infile, "r") as f:
        data = json.load(f)

    children = data['children']

    # 자식 노드에 대해 재귀 호출을 수행합니다.
    for child in children:
        recursive(child, result_out)

    # 그리고 해당 결과를 파일로 저장합니다.
    with open(outfile, "w") as f:
        f.write("".join("<annotation><folder />"))
        f.write("".join("<filename>" + imgName + "</filename>\n"
                    "<path>" + imgName + "</path>\n"+
                    "<source><database>RICO</database></source><size><width>360</width><height>640</height><depth>3</depth></size><segmented>0</segmented>"))
        f.write("".join(result_out))
        f.write("".join("</annotation>"))


def search(mypath):
    onlyfiles = [f for f in os.listdir(mypath)
                 if os.path.isfile(os.path.join(mypath, f))]
    onlyfiles.sort()    
    return onlyfiles


def main():
    """
    메인 함수
    """
    files = search("json")
    # print(files)
    for infile in files:
        infile = f'./json/{infile}'
        outfile = infile.replace("json", "xml")
        print(infile, outfile)
        json2xml(infile, outfile)


if __name__ == "__main__":
    main()
